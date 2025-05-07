from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.vectorstores import FAISS
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.document_loaders import TextLoader
from dotenv import load_dotenv
import os

# Load .env
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
assert api_key, "GROQ_API_KEY not found in .env file!"

# Load FAQ file
faq_path = os.path.join(os.path.dirname(__file__), "faq.txt")
if not os.path.exists(faq_path):
    raise FileNotFoundError("faq.txt file is missing.")

try:
    loader = TextLoader(faq_path, encoding="utf-8")
    documents = loader.load()
except Exception as e:
    raise RuntimeError(f"Failed to load faq.txt: {str(e)}")

# Initialize model and vector store
llm = ChatGroq(groq_api_key=api_key, model="gemma2-9b-it")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
splits = text_splitter.split_documents(documents)
vectorstore = FAISS.from_documents(splits, embeddings)
retriever = vectorstore.as_retriever()

# Prompt templates
contextualize_q_prompt = ChatPromptTemplate.from_messages([
    ("system", "Given a chat history and the latest user question which may reference context, reformulate it to be self-contained."),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}")
])
history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

qa_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an assistant that answers questions based on the FAQ context. "
               "If the question is not answerable, respond with 'I don't know'. "
               "If unrelated, say 'This question is not related to the FAQ.'\n\nContext:\n{context}"),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}")
])
qa_chain = create_stuff_documents_chain(llm, qa_prompt)
rag_chain = create_retrieval_chain(history_aware_retriever, qa_chain)

# Store for message histories
session_store = {}
session_id = "terminal_user"

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in session_store:
        session_store[session_id] = ChatMessageHistory()
    return session_store[session_id]

conversational_rag_chain = RunnableWithMessageHistory(
    rag_chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="answer"
)

# Terminal interaction loop
print("\n🤖 Welcome to the Smart Financial Assistant FAQ Bot!")
print("Type your question below. Type 'exit' or 'quit' to end.\n")

while True:
    try:
        user_input = input("You: ").strip()
        if user_input.lower() in {"exit", "quit"}:
            print("👋 Exiting. Have a great day!")
            break

        response = conversational_rag_chain.invoke(
            {"input": user_input},
            config={"configurable": {"session_id": session_id}}
        )
        print(f"SFA Bot: {response['answer']}\n")

    except KeyboardInterrupt:
        print("\n👋 Exiting. Goodbye!")
        break

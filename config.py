from dotenv import load_dotenv
import os
dotenv_path = '/Users/rohangarg/Documents/Enerva/CALTRACK_dev/.env'
load_dotenv(dotenv_path)
# load_dotenv()

DATABASE_NAME = os.getenv('DATABASE_NAME')
USER = os.getenv('DB_USER')
PASSWORD = os.getenv('PASSWORD')
KEY_PATH = os.getenv('KEY_PATH')
SSH_IP = os.getenv('SSH_IP')
SSH_USER = os.getenv('SSH_USER')
DB_HOST = os.getenv('DB_HOST')
LOCAL_HOST = os.getenv('LOCAL_HOST')
LOCAL = os.getenv('IS_LOCAL')
PORT = os.getenv('PORT')
# if LOCAL:
#     DB_HOST = "localhost"

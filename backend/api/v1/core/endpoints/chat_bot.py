from openai import OpenAI
from settings import settings
from fastapi import APIRouter, Depends, HTTPException, status, Response
from chat_setup import client
from api.v1.core.schemas import ChatBotIn, ChatBotOut
router = APIRouter()

@router.post("/question", status_code=200)
def chat_bot(message_data: ChatBotIn):
    """
    Chat with the bot
    """
    print("Received message data:", message_data)
    conversation_history_pydantic = message_data.messages
    history_for_api = [message.dict() for message in conversation_history_pydantic]
    print("Sending history to OpenAI:", history_for_api)

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-nano",
            messages=history_for_api
        )
        print(f"Response from OpenAI: {response}")
        return ChatBotOut(message=response.choices[0].message.content)

    except OpenAI.BadRequestError as e:
        print(f"OpenAI API Error: {e}")
        if e.response:
            print(f"Error Response Body: {e.response.text}")
        raise HTTPException(status_code=400, detail=f"Invalid request to OpenAI: {e.body.get('message', 'Unknown error')}") from e
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
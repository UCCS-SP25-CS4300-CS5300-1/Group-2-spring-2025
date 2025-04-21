import json
from channels.generic.websocket import AsyncWebsocketConsumer
#may need to add this to requirements if keeping ^

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(text_data=json.dumps({
            'message': 'Connection established!'
        }))

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.send(text_data=json.dumps({
            'message': f"Echo: {data['message']}"
        }))

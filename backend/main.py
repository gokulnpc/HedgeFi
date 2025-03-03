from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.constant.config import SECRET_KEY
from app.middleware.log import APIGatewayMiddleware
from starlette.middleware.sessions import SessionMiddleware
import uvicorn
#from app.database.database import session_manager
from contextlib import asynccontextmanager

from app.routers import memecoin, tools, coingecko

# @asynccontextmanager
# async def lifespan(app: FastAPI):  
#     await session_manager.create_tables()
#     yield
#     if session_manager._engine is not None:
#         await session_manager.close()
        
# app = FastAPI(lifespan=lifespan)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'], #  allows requests from any origin 
    allow_credentials=True,
    allow_methods=['*'], # allows all HTTP methods
    allow_headers=['*'], # allows all headers
)
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)
app.add_middleware(APIGatewayMiddleware)

router_list = [
    memecoin.router,
    tools.router,
    coingecko.router
]

for router in router_list:
    app.include_router(router=router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

#redis_client = Redis.from_url(REDIS_URL, decode_responses=True)

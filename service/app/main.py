from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.routes.payment import router as payment_router

app = FastAPI(title="Payment Processing Service")

app.include_router(payment_router)


@app.exception_handler(RequestValidationError)
async def validation_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={"error": str(exc)},
    )

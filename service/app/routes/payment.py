import random

from fastapi import APIRouter

from app.schemas.payment import PaymentRequest, PaymentResponse

router = APIRouter()


@router.post("/process-payment", response_model=PaymentResponse)
def process_payment(req: PaymentRequest):
    approved = random.random() < 0.8
    if approved:
        return PaymentResponse(
            status="approved", message="Pago procesado correctamente"
        )
    return PaymentResponse(status="rejected", message="Fondos insuficientes")

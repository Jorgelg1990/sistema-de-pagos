from pydantic import BaseModel, Field


class PaymentRequest(BaseModel):
    amount: float = Field(gt=0, description="Monto del pago, debe ser > 0")


class PaymentResponse(BaseModel):
    status: str
    message: str

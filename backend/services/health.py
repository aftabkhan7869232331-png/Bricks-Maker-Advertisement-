from ..models.health import HealthResponse


def get_health() -> HealthResponse:
    return HealthResponse(status="ok", service="python-ai")

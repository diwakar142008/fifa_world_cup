"""AI Simulation Engine API endpoints.

Allows organizers to ask 'what if' questions and see predicted impacts
on queue times, walking times, safety, transport, revenue, and crowd flow.
"""

from fastapi import APIRouter
from app.schemas.base import APIResponse
from app.schemas.simulation import SimulationRequest, SimulationResponse, ScenarioPreset
from app.services.simulation import run_simulation, SCENARIO_PRESETS

router = APIRouter(prefix="/simulation", tags=["Simulation"])


@router.post("/run", response_model=APIResponse[SimulationResponse])
async def run_simulation_endpoint(request: SimulationRequest):
    """Run a what-if simulation based on a natural language query.

    Examples:
    - "What happens if Gate A closes?"
    - "What happens if it starts raining?"
    - "What happens if Metro Line 2 stops?"
    """
    result = run_simulation(request)
    return APIResponse(data=result)


@router.get("/presets", response_model=APIResponse[list[ScenarioPreset]])
async def get_simulation_presets():
    """Get all pre-defined simulation scenarios."""
    return APIResponse(data=SCENARIO_PRESETS)


@router.get("/results/{simulation_id}")
async def get_simulation_result(simulation_id: str):
    """Get a previously run simulation result by ID."""
    # In mock mode, return a placeholder. In production, fetch from DB.
    return APIResponse(data={
        "id": simulation_id,
        "status": "completed",
        "message": "Simulation result retrieved",
    })

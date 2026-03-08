import { STATE } from "../prisma";

export const determineState = (
    currentScore: number,
    lastScore: number,
    maxScore: number
): STATE => {

    const sweepFreeScore = Math.ceil(Number(lastScore) * 0.9);

    if (currentScore === sweepFreeScore) {
        return STATE.SWEEP_FREE;
    }

    if (currentScore === maxScore) {
        return STATE.SWEEP_PAY;
    }

    if (currentScore > lastScore) {
        return STATE.HIGHER;
    }

    return STATE.LOWER;
}
import {
    UPDATE_STATE,
} from './actionTypes';

export function updateGameState(data) {
    return {
        type: UPDATE_STATE,
        data
    };
}

import {
    UPDATE_STATE,
    CONNECTION_CHANGED
} from './actionTypes';

export function updateGameState(data) {
    return {
        type: UPDATE_STATE,
        data
    };
}
export function connectionUpdated(self, connected) {
    return {
        type: CONNECTION_CHANGED,
        self,
        connected
    };
}

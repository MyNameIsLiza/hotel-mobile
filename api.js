import axios from "axios";

const uri = "https://liza-hotel-api.herokuapp.com/api";

function getRooms() {
    return axios
        .get(uri + "/rooms")
        .then((res) => {
            //console.log(res.data.result);
            return res.data.result;
        })
        .catch((err) => {
            return err.message;
        });
}

function addRoom(room) {
    return axios
        .post(uri + "/rooms", room)
        .then((res) => {
            return res.data.result;
        })
        .catch((err) => {
            return err.message;
        });
}

function editRoom(room) {
    return axios
        .post(uri + "/rooms/edit", room)
        .then((res) => {
            console.log(res.data);
            return res.data.result;
        })
        .catch((err) => {
            console.log(err);
            return err.message;
        });
}

function deleteRoom(room) {
    return axios
        .delete(uri + "/rooms/" + room.id, room)
        .then((res) => {
            return res.data.result;
        })
        .catch((err) => {
            return err.message;
        });
}
export { getRooms, addRoom, editRoom, deleteRoom };

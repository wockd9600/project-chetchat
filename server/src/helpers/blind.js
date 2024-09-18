
// When leave blind chat
// Stop matching
// Leave blind chat

const leaveRooms = async (socket, rooms, room_type) => {
    return Promise.all(rooms.map(item => {
        if (room_type.some(type => item.includes(type))) {
            return new Promise((resolve) => {
                socket.leave(item);
                resolve();
            });
        }
        return Promise.resolve();
    }));
}

export {
    leaveRooms,
}
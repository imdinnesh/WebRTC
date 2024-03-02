import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../Context/SocketProvider";
import '../App.css'

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div>
      <div className="flex">
        

        <div className="w-3/4 h-screen">
          <div className="rounded-lg shadow-lg bg-white m-auto mt-40 p-8 w-2/5">

            <form className='flex flex-col items-center justify-center space-y-1.5'
              onSubmit={handleSubmitForm}>
              <div className='mt-10'>

                <label htmlFor='email' className='w-24 h-10 inline-block'>Enter Email</label>
                <input type="email" id='email'
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className='w-64 h-10 border-2 px-1 border-gray-300 rounded-md' />
              </div>
              <div>

                <label htmlFor='room' className='w-24 h-10 inline-block'>Enter Room</label>
                <input type="text" id='room'
                  value={room}
                  onChange={(event) => setRoom(event.target.value)}
                  className='w-64 h-10 border-2 px-1  border-gray-300 rounded-md' />
              </div>

              <button
                className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>
                Enter Room
              </button>
            </form>
          </div>

        </div>

        <div className="w-1/4 h-screen bg-slate-500"></div>
      </div>
    </div>
  );
};

export default LobbyScreen;

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

  function generateRoomNumber() {
    // Generate a random 6-digit number
    const number = Math.floor(100000 + Math.random() * 900000);

    // Convert the number to a string
    const str = number.toString();

    // Insert a '-' after every two digits
    const roomNumber = str.replace(/(...?)/g, '$1-').slice(0, -1);

    return roomNumber;
  }

  useEffect(() => {
    setRoom(generateRoomNumber())
  }, [])



  return (
    <div>
      <div className="flex">


        <div className="w-full h-screen flex items-center">
          <div className="rounded-lg bg-white m-auto p-7 border-2 border-gray-200">
            <h1 className="px-2 font-semibold text-pretty text-lg">Video Calling App</h1>
            <p className="px-2 text-gray-500 text-sm">Create a room to for video calling</p>
            <form className='flex flex-col justify-center'
              onSubmit={handleSubmitForm}>
              <div className='mt-6'>

                <label htmlFor='email' className='w-24 h-10 block font-semibold text-sm'>Email</label>
                <input type="email" id='email'
                  value={email}
                  placeholder="johndoe@example.com"
                  onChange={(event) => setEmail(event.target.value)}
                  className='w-80 h-10 border-2 border-gray-300 rounded-md px-2 -mt-3' />
              </div>
              <div className="mt-4">
                <label htmlFor='room' className='w-24 h-10 block font-semibold text-sm'>Room ID</label>
                <input type="text" id='room'
                  value={room}
                  onChange={(event) => setRoom(event.target.value)}
                  placeholder={room}
                  //disabled
                  className='w-80 h-10 border-2 border-gray-300 rounded-md px-2 -mt-3' />
              </div>

              <button
                className=' w-80 h-10 mt-4 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>
                Create a Room
              </button>
              <div className="mt-2 flex space-x-2 items-center">
                <hr className="mt-1 w-36" />
                <h1 className="text-gray-400">or</h1>
                <hr className="mt-1 w-36" />
              </div>
              <button
                // onClick={JoinRoomComponent} 
                className="w-80 h-10 mt-4 px-5 py-2.5 me-2 mb-2 border-2 border-gray-200 rounded-lg text-sm hover:bg-gray-200">
                Join a Room
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LobbyScreen;

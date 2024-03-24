import React, { useEffect, useCallback, useState } from "react";
import peer from "../Service/peer";
import { useSocket } from "../Context/SocketProvider";
import VideoLayout from "../Components/VideoLayout";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [height, setHeight] = useState('700px');
  const [width, setWidth] = useState('1300px');

  //Modifications...
  const [remoteEmail, setRemoteEmail] = useState("");

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteEmail(email);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    // const stream = await navigator.mediaDevices.getUserMedia({
    //   audio: true,
    //   video: true,
    // });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    // setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);


  ///Modifications...
  useEffect(() => {
    const getMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
    };
    getMedia();
  }, []);

  useEffect(() => {
    if (remoteStream) {
      setHeight('600px')
      setWidth('700px')
    }
  }, [remoteStream])

  const endCall=useCallback(async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: false,
    });
    setMyStream(stream);

  })






  return (
    <div className="h-screen w-full bg-black text-white">
      <div className="p-4">
        <h4 className="text-center">{remoteSocketId ? "User Connected" : "Looks like there is no one in the room"}</h4>
        <div className="flex flex-col">
          {remoteSocketId && <div className="flex space-x-3 justify-end">
            <h1 className="mt-2">{remoteEmail ? `${remoteEmail} has requested to join the meeting` : " "}</h1>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={handleCallUser}>Invite</button>
          </div>}
          {remoteStream && <div className="mt-5">
            <button
            className=" w-40 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={sendStreams}>Send Stream</button>
            </div>}
        </div>


      </div>


      <div className="flex justify-center p-2">

        {myStream && (

          <div className="w-full">
            <VideoLayout streamSrc={myStream} ht={height} wd={width} />
            <h1 className="text-white -mt-10">You</h1>
          </div>
        )}
        {remoteStream && (
          <div className="w-full">
            <VideoLayout streamSrc={remoteStream} ht={height} wd={width} />
            <h1 className="text-white -mt-10">{remoteEmail ? remoteEmail : 'Remote Stream'}</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPage;

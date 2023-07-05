// project importsla
import React, { useRef, useState, useEffect, useContext } from 'react';
import MeetingRoom1 from './MeetingRoom1';
import MeetingRoom2 from './MeetingRoom2';

const Meeting = (props) => {
    return <div>{true ? <MeetingRoom1 /> : <MeetingRoom2 />}</div>;
};

export default Meeting;

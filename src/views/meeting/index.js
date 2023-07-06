// project importsla
import React, { useRef, useState, useEffect, useContext } from 'react';
import MeetingRoom1 from './MeetingRoom1';
import MeetingRoom2 from './MeetingRoom2';
import { useLocation } from 'react-router';

const Meeting = (props) => {
    const { state } = useLocation();

    return <div>{true ? <MeetingRoom1 state={state} /> : <MeetingRoom2 state={state} />}</div>;
};

export default Meeting;

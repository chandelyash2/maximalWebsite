// src/ToggleButton.js

import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { database } from '../firebaseconfig';
import { ref, get, set } from 'firebase/database'; 

const ToggleButton = ({ permission, name, reportid, userId}) => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
    if(permission=="Report")
    {
    const Ref = ref(database, `users/${userId}/permissions/${permission}/${reportid}`);
    const updatedata = {
        id: reportid,
        name: name,
      [permission]: !isActive
    };
    set(Ref,updatedata);
    }
    else
    {
        const Ref = ref(database, `users/${userId}/permissions/${permission}`);
        const updatedata = {
          [name]: !isActive
        };     
        set(Ref,updatedata);   
    }
   
  };

  return (
    <Button variant={isActive ? 'success' : 'danger'} onClick={handleToggle}>
      {name}
    </Button>
  );
}

export default ToggleButton;

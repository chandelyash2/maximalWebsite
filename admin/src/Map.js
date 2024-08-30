import React, {useCallback, useState} from 'react';
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';

const MapComponent = ({onSubmit}) => {
    const [marker, setMarker] = useState();

    const handleMapClick = useCallback((event) => {
        const newMarker = {
            lat: event.detail.latLng.lat,
            lng: event.detail.latLng.lng,
        };
        setMarker(newMarker)
        onSubmit(newMarker)
    }, []);

    return <APIProvider apiKey={"AIzaSyCR-soGi4VvGPwNq-1NWLthPZXwwcoGZo8"}>
        <Map
            style={{height: '50vh',width:'50vh'}}
            defaultCenter={{lat: 0, lng: 0}}
            defaultZoom={3}
            onClick={handleMapClick}
        >
            {marker &&
                <Marker key={marker} position={marker}/>
            }
        </Map>
    </APIProvider>
};

export default MapComponent

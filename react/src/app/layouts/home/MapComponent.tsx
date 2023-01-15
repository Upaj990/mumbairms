/* eslint-disable no-lone-blocks */
import { useState, useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import './style.css';
import { Backdrop, CircularProgress, Button, Box } from '@mui/material';
import _ from '../../config';
import { useLocation, useNavigate } from 'react-router-dom';
import PageviewTwoToneIcon from '@mui/icons-material/PageviewTwoTone';
import { IconButton } from '@mui/material';


import './style.css'


const PlacesAutocomplete = ({ setSelected }: any) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address: any) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
  };



  const buttonStyles = {
    // width: "80%",
    borderRadius: 0
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        // className="combobox-input"
        style={{ width: 1060, maxWidth: "100%", padding: "0.5rem", zIndex: "100 !important", borderRadius: "0.5rem" }}
        placeholder="Address"
      />
      {/* <IconButton size="large" aria-label="add">
        <PageviewTwoToneIcon sx={{ fontSize: "40px" }} />
      </IconButton> */}
      <ComboboxPopover >
        <ComboboxList >
          {status === "OK" &&
            data.map(({ place_id, description }: any) => (
              //  { console.log(description)};
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};



function MapComponent() {
  const navigation = useNavigate()

  const [selected, setSelected] = useState(null);
  const [latitude, setlatitude] = useState(0);
  const [longitude, setlongitude] = useState(0);
  const [lati, setLatitude] = useState(0);
  const [long, setLongitude] = useState(0);
  const [loading, setloading] = useState(false);
  const [select, setSelect] = useState(null);

  // const [lat, setlatitude] = useState(0);
  // const [lon, setlongitude] = useState(0);

  const handleClickedMap = (e: any) => {
    let latitude = e.latLng.lat();
    let longitude = e.latLng.lng();
    setlatitude(latitude);
    setlongitude(longitude);
    localStorage.setItem('latitude',latitude);
    localStorage.setItem('longitude',longitude);
    console.log(latitude, longitude);
  }

  navigator.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: lng } }) => {

    setLatitude(lat)

    setLongitude(lng)
  });
  const center = useMemo(() => ({ lat: lati, lng: long }), [lati, long]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCQrZ9c3sG2VfngRvb3qWUdUD2Q0ussOhY",
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return (<>
    <div className="places-container">
      <PlacesAutocomplete setSelected={setSelected} />
    </div>

    <GoogleMap
      zoom={7}
      center={center}
      mapContainerClassName="map-container"
      onClick={handleClickedMap}
    >
      {!selected && <Marker key="marker_1"

        position={{

          lat: lati,

          lng: long

        }}

      />}
      {selected && <Marker position={selected} />}
      {/* {select && <Marker position={select} />} */}
    </GoogleMap>
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 10 }}>
      <Button onClick={ () => {
        const variable= localStorage.getItem('pick');
        const item= localStorage.getItem('pickdata');
        console.log("motahe ",item);
        if(variable=='pickedused' && item!=null){
          navigation('/admin/restaurant/add-new-restaurant',
          { state: {TAG:'EDIT',data:JSON.parse(item)} })
        }
        else{
          navigation('/admin/restaurant/add-new-restaurant');
        }

       
    
    }} sx={{ width: '15%', backgroundColor: _.colors.colorOrange, ":hover": { backgroundColor: '#E16512' } }} size='medium' variant="contained">Submit</Button>
      <Button onClick={() => navigation('/admin/restaurant/add-new-restaurant')} sx={{ width: '15%', backgroundColor: _.colors.colorGray2, ":hover": { backgroundColor: '#A0A0A0' }, marginLeft: 2 }} size='medium' variant="contained">Cancel</Button>
    </Box>
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}>
      <CircularProgress color='inherit' />
    </Backdrop>
  </>)
}





export default MapComponent;
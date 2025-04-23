"use client";

// react
import { ReactElement, ComponentProps, cloneElement } from "react";
// shared
import { cn } from "@/shared/lib/utils";
import { defaultMarkerCoordiates } from "@/shared/constants/googleMap";
// react-google-maps
import { GoogleMap, Marker } from "@react-google-maps/api";

export type MarkerType = ReactElement<ComponentProps<typeof Marker>>;

export type MarkerCoordinates = {
	lat: number;
	lng: number;
};

type MarkerAddress = {
	country: string;
	state: string;
	city: string;
	street: string;
	streetNumber: string;
};

type MarkerPostalCode = string;

export type MarkerInfo = {
	coordinates: MarkerCoordinates;
	address: MarkerAddress;
	postalCode: MarkerPostalCode;
};

type Props = {
	className?: string;
	isMarkerDraggable?: boolean;
	markers?: MarkerType[];
	centerCoordinates?: MarkerCoordinates;
	markerPositionChange?: (value: MarkerInfo, index: number) => void;
};

// default styling
const defaultMapContainerStyle = {
	width: "100%",
	height: "100%",
	borderRadius: "15px",
};

// default map coordinates
const defaultMapCenter = defaultMarkerCoordiates;

// default zoom level
const defaultMapZoom = 5;

// default map options
const defaultMapOptions = {
	zoomControl: true,
	tilt: 0,
	gestureHandling: "auto",
	mapTypeId: "roadmap",
};

const Index = ({
	className = "",
	markers = [],
	isMarkerDraggable = false,
	// markerPositionChange,
	centerCoordinates,
}: Props) => {
	// const geocoder = new google.maps.Geocoder();

	// const handleMarkerDragEnd = async (event: google.maps.MapMouseEvent, index: number) => {
	// 	const newLat = event?.latLng?.lat();
	// 	const newLng = event?.latLng?.lng();

	// 	if (newLat == null || newLng == null) return;

	// 	const newPosition = { lat: newLat, lng: newLng };
	// 	// const updatedMarkerPositions = [...markerPositions];
	// 	// updatedMarkerPositions[index] = newPosition;
	// 	// setMarkerPositions(updatedMarkerPositions);

	// 	const newAddress = {
	// 		country: "",
	// 		state: "",
	// 		city: "",
	// 		street: "",
	// 		streetNumber: "",
	// 	} as MarkerAddress;
	// 	let newPostalCode = "" as MarkerPostalCode;

	// 	// Fetching address using the Geocoding API
	// 	await geocoder.geocode({ location: newPosition }, (results, status) => {
	// 		if (status === "OK" && results) {
	// 			results[0].address_components.forEach((address) => {
	// 				if (address.types.includes("country")) newAddress.country = address.long_name;
	// 				if (address.types.includes("locality")) newAddress.city = address.long_name;
	// 				if (address.types.includes("route")) newAddress.street = address.long_name;
	// 				if (address.types.includes("street_number")) newAddress.streetNumber = address.long_name;
	// 				if (address.types.includes("administrative_area_level_1")) newAddress.state = address.long_name;
	// 				if (address.types.includes("postal_code")) newPostalCode = address.long_name;
	// 			});
	// 		}
	// 	});

	// 	markerPositionChange &&
	// 		markerPositionChange({ coordinates: newPosition, address: newAddress, postalCode: newPostalCode }, index);
	// };

	return (
		<div className={cn(className, "flex h-60 flex-col")}>
			{/* <MapProvider> */}
			<div className="h-full w-full">
				<GoogleMap mapContainerStyle={defaultMapContainerStyle} center={centerCoordinates || defaultMapCenter} zoom={defaultMapZoom} options={defaultMapOptions}>
					{markers.map((marker, index) =>
						cloneElement(marker, {
							key: index,
							draggable: isMarkerDraggable,
							// onDragEnd: (event: google.maps.MapMouseEvent) => handleMarkerDragEnd(event, index),
						}),
					)}
					{/* {markerPositions.map((position, index) => (
					<Marker
						key={index}
						position={position}
						draggable={isMarkerDraggable}
						onDragEnd={(event) => handleMarkerDragEnd(event, index)}
						onMouseOver={() => setHoveredMarkerIndex(index)} // Show InfoWindow on hover
						onMouseOut={() => setHoveredMarkerIndex(null)} // Hide InfoWindow on mouse out
					>
						{hoveredMarkerIndex === index && (
							<InfoWindow position={position}>
								<div>
									<p>Coordinates:</p>
									<p>Lat: {position.lat}</p>
									<p>Lng: {position.lng}</p>
								</div>
							</InfoWindow>
						)}
					</Marker>
				))} */}
				</GoogleMap>
			</div>
			{/* </MapProvider> */}
		</div>
	);
};

export default Index;

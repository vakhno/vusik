"use client";

import { cn } from "@/lib/utils";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useState } from "react";
import { defaultMarkerCoordiates } from "@/constants/googleMap";

type markerCoordinates = {
	lat: number;
	lng: number;
};

type markerAdress = {
	country: string;
	city: string;
	street: string;
	streetNumber: string;
};

type markerPostalCode = string;

export type markerInfo = {
	coordinates: markerCoordinates;
	adress: markerAdress;
	postalCode: markerPostalCode;
};

type Props = {
	className?: string;
	isMarker?: boolean;
	isMarkerDraggable?: boolean;
	markerCoordinates?: markerCoordinates;
	centerCoordinates?: markerCoordinates;
	markerPositionChange?: (value: markerInfo) => void;
};

// default styling
const defaultMapContainerStyle = {
	width: "100%",
	height: "100%",
	borderRadius: "15px 0px 0px 15px",
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

const MapComponent = ({
	className,
	markerCoordinates,
	centerCoordinates,
	isMarker = false,
	isMarkerDraggable = false,
	markerPositionChange,
}: Props) => {
	const [markerPosition, setMarkerPosition] = useState(markerCoordinates || defaultMapCenter);
	const geocoder = new google.maps.Geocoder();

	const handleMarkerDragEnd = async (event: google.maps.MapMouseEvent) => {
		const newLat = event.latLng.lat();
		const newLng = event.latLng.lng();
		const newPosition = { lat: newLat, lng: newLng } as markerCoordinates;
		const newAdress = {
			country: "",
			city: "",
			street: "",
			streetNumber: "",
		} as markerAdress;
		let newPostalCode = "" as markerPostalCode;

		setMarkerPosition(newPosition);

		// fetching address using the Geocoding API
		await geocoder.geocode({ location: newPosition }, (results, status) => {
			if (status === "OK") {
				if (results) {
					results[0].address_components.forEach((adress) => {
						if (adress.types.includes("country")) {
							newAdress.country = adress.long_name;
						}
						if (adress.types.includes("locality")) {
							newAdress.city = adress.long_name;
						}
						if (adress.types.includes("route")) {
							newAdress.street = adress.long_name;
						}
						if (adress.types.includes("street_number")) {
							newAdress.streetNumber = adress.long_name;
						}
						if (adress.types.includes("postal_code")) {
							newPostalCode = adress.long_name;
						}
					});
				}
			}
		});

		markerPositionChange &&
			markerPositionChange({ coordinates: newPosition, adress: newAdress, postalCode: newPostalCode });
	};

	return (
		<div className={cn(className, "h-full w-full")}>
			<GoogleMap
				mapContainerStyle={defaultMapContainerStyle}
				center={centerCoordinates || defaultMapCenter}
				zoom={defaultMapZoom}
				options={defaultMapOptions}
			>
				{isMarker ? (
					<Marker position={markerPosition} draggable={isMarkerDraggable} onDragEnd={handleMarkerDragEnd} />
				) : null}
			</GoogleMap>
		</div>
	);
};

export { MapComponent };

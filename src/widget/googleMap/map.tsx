"use client";

import { cn } from "@/lib/utils";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { defaultMarkerCoordiates } from "@/constants/googleMap";

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
	markerCoordinates?: MarkerCoordinates[];
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

const MapComponent = ({
	className,
	markerCoordinates = [],
	centerCoordinates,
	isMarkerDraggable = false,
	markerPositionChange,
}: Props) => {
	const [markerPositions, setMarkerPositions] = useState<MarkerCoordinates[]>(markerCoordinates);
	const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState<number | null>(null);

	useEffect(() => {
		setMarkerPositions(markerCoordinates);
	}, [markerCoordinates]);

	const geocoder = new google.maps.Geocoder();

	const handleMarkerDragEnd = async (event: google.maps.MapMouseEvent, index: number) => {
		const newLat = event?.latLng?.lat();
		const newLng = event?.latLng?.lng();

		if (newLat == null || newLng == null) return;

		const newPosition = { lat: newLat, lng: newLng };
		const updatedMarkerPositions = [...markerPositions];
		updatedMarkerPositions[index] = newPosition;
		setMarkerPositions(updatedMarkerPositions);

		const newAddress = {
			country: "",
			state: "",
			city: "",
			street: "",
			streetNumber: "",
		} as MarkerAddress;
		let newPostalCode = "" as MarkerPostalCode;

		// Fetching address using the Geocoding API
		await geocoder.geocode({ location: newPosition }, (results, status) => {
			if (status === "OK" && results) {
				results[0].address_components.forEach((address) => {
					if (address.types.includes("country")) newAddress.country = address.long_name;
					if (address.types.includes("locality")) newAddress.city = address.long_name;
					if (address.types.includes("route")) newAddress.street = address.long_name;
					if (address.types.includes("street_number")) newAddress.streetNumber = address.long_name;
					if (address.types.includes("administrative_area_level_1")) newAddress.state = address.long_name;
					if (address.types.includes("postal_code")) newPostalCode = address.long_name;
				});
			}
		});

		markerPositionChange &&
			markerPositionChange({ coordinates: newPosition, address: newAddress, postalCode: newPostalCode }, index);
	};
	return (
		<div className={cn(className, "h-full w-full")}>
			<GoogleMap
				mapContainerStyle={defaultMapContainerStyle}
				center={centerCoordinates || defaultMapCenter}
				zoom={defaultMapZoom}
				options={defaultMapOptions}
			>
				{markerPositions.map((position, index) => (
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
				))}
			</GoogleMap>
		</div>
	);
};

export { MapComponent };

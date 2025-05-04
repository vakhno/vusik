"use client";

// react
import { ReactElement, ComponentProps, useState } from "react";
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
	markerPositionChange?: (value: MarkerInfo) => void;
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

const Index = ({ className = "", isMarkerDraggable = false, markerPositionChange, centerCoordinates }: Props) => {
	const [markerPosition, setMarkerPosition] = useState<MarkerCoordinates>(centerCoordinates || defaultMapCenter);

	const handleMapClick = async (e: google.maps.MapMouseEvent) => {
		if (!e.latLng) return;

		const newPosition = {
			lat: e.latLng.lat(),
			lng: e.latLng.lng(),
		};

		setMarkerPosition(newPosition);
		await handlePositionChange(newPosition);
	};

	const handleMarkerDragEnd = async (e: google.maps.MapMouseEvent) => {
		if (!e.latLng) return;

		const newPosition = {
			lat: e.latLng.lat(),
			lng: e.latLng.lng(),
		};

		setMarkerPosition(newPosition);
		await handlePositionChange(newPosition);
	};

	const handlePositionChange = async (position: MarkerCoordinates) => {
		if (!markerPositionChange) return;

		const geocoder = new google.maps.Geocoder();

		try {
			const results = await geocoder.geocode({ location: position });

			if (results.results && results.results[0]) {
				const addressComponents = results.results[0].address_components;
				const newAddress = {
					country: "",
					state: "",
					city: "",
					street: "",
					streetNumber: "",
				};
				let postalCode = "";

				addressComponents.forEach((component) => {
					if (component.types.includes("country")) newAddress.country = component.long_name;
					if (component.types.includes("locality")) newAddress.city = component.long_name;
					if (component.types.includes("route")) newAddress.street = component.long_name;
					if (component.types.includes("street_number")) newAddress.streetNumber = component.long_name;
					if (component.types.includes("administrative_area_level_1")) newAddress.state = component.long_name;
					if (component.types.includes("postal_code")) postalCode = component.long_name;
				});

				markerPositionChange({
					coordinates: position,
					address: newAddress,
					postalCode,
				});
			}
		} catch (error) {
			console.error("Geocoding error:", error);
		}
	};

	return (
		<div className={cn(className)}>
			<div className="h-full w-full">
				<GoogleMap mapContainerStyle={defaultMapContainerStyle} center={markerPosition} zoom={defaultMapZoom} options={defaultMapOptions} onClick={handleMapClick}>
					<Marker position={markerPosition} draggable={isMarkerDraggable} onDragEnd={handleMarkerDragEnd} />
				</GoogleMap>
			</div>
		</div>
	);
};

export default Index;

// react
import { useState } from "react";
// react-google-maps
import { Marker, InfoWindow } from "@react-google-maps/api";
import { MarkerCoordinates } from "@/shared/shared/GoogleMap";
// entities
import { ShelterType } from "@/entities/shelter/model/type/shelter";

type ShelterMarkerProps = {
	position: MarkerCoordinates;
	shelter: ShelterType;
};

const Index = ({ position, shelter }: ShelterMarkerProps) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Marker
			position={position}
			icon={{
				url: "/icons/map-marker.svg",
				scaledSize: new google.maps.Size(40, 40),
			}}
			onMouseOver={() => setIsHovered(true)}
			onMouseOut={() => setIsHovered(false)}
		>
			{isHovered ? (
				<InfoWindow position={position}>
					<div>
						<h3>{shelter.name}</h3>
						<div>{shelter.state}</div>
						<div>{shelter.city}</div>
					</div>
				</InfoWindow>
			) : null}
		</Marker>
	);
};

export default Index;

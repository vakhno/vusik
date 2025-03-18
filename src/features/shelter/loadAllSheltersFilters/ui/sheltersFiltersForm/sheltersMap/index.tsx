// widgets
import { MapProvider } from "@/widget/googleMap/mapProvider";
import { MapComponent, MarkerCoordinates } from "@/widget/googleMap/map";

type Props = {
	shelterMarkers: MarkerCoordinates[];
};

const Index = ({ shelterMarkers }: Props) => {
	return (
		<div className="mb-4 flex h-60 flex-col px-10">
			<MapProvider>
				<MapComponent markerCoordinates={shelterMarkers} />
			</MapProvider>
		</div>
	);
};

export default Index;

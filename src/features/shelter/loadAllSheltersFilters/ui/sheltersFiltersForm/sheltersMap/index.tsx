// widgets
import GoogleMapProvider from "@/shared/providers/GoogleMapProvider";
import MapComponent from "@/shared/shared/GoogleMap";

// type Props = {
// 	shelterMarkers: MarkerCoordinates[];
// };

const Index = () => {
	return (
		<div className="mb-4 flex h-60 flex-col px-10">
			<GoogleMapProvider>
				<MapComponent />
			</GoogleMapProvider>
		</div>
	);
};

export default Index;

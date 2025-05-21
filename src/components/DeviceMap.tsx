import 'leaflet/dist/leaflet.css'
// @ts-expect-error Импорт работает но подсвечивает ошибкой (мб баг npm пакета)
import 'react-leaflet-markercluster/styles'
import './DeviceMap.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import devicesData from '../data/devices.json'
import { advancedIcon, basicIcon, specialIcon } from '../icons/icons'
import type { IDevice } from '../types/types'
import MarkerClusterGroup from 'react-leaflet-markercluster'

const getIcon = (model: IDevice["model"]) => {
    switch(model) {
        case "basic": return basicIcon;
        case "advanced": return advancedIcon;
        case "special": return specialIcon;
    }
}

export const DeviceMap = () => {
    const handleDragEnd = (e: L.DragEndEvent) => {
        const { lat, lng } = e.target.getLatLng();
        console.log(`Новое местоположение метки: ${lat}, ${lng}`);
    };

    const devices: IDevice[] = devicesData as IDevice[]

    return (
        <MapContainer center={[55.751244, 37.618423]} zoom={13}>
        <TileLayer 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {devices && devices.map((device, index: number) => (
            <Marker
                key={index}
                position={[device.lat, device.lon]}
                icon={getIcon(device.model as "basic" | "advanced" | "special")}
                draggable={index === 2}
                eventHandlers={{
                    dragend: index === 2 ? handleDragEnd : undefined,
                }}
            > 
                <Popup>
                    <ul className='popup__list'>
                        <li className='popup__item'>Name: {device.name}</li>
                        <li className='popup__item'>Model: {device.model}</li>
                        <li className='popup__item'>Status: {device.status}</li>
                    </ul>
                </Popup>
            </Marker>
        ))}

        <MarkerClusterGroup>
            {devices.flatMap(device =>
                device.children?.map(child => (
                <Marker
                    key={child.id}
                    position={[child.lat, child.lon]}
                    icon={getIcon(child.model as "basic" | "advanced" | "special")}
                >
                    <Popup>
                        <ul className='popup__list'>
                            <li className='popup__item'>Name: {device.name}</li>
                            <li className='popup__item'>Model: {device.model}</li>
                            <li className='popup__item'>Status: {device.status}</li>
                        </ul>
                    </Popup>
                </Marker>
                )) ?? [] 
            )}
        </MarkerClusterGroup>
        </MapContainer>
    )
}
import BaseVectorMap from '@/components/BaseVectorMap'
import {getWorldMarkerLineOptions} from '@/views/maps/vector/data'

import 'jsvectormap'
import 'jsvectormap/dist/maps/world-merc'

const WorldMapMarkerLine = () => {
    return <BaseVectorMap id="world-map-marker-line" options={getWorldMarkerLineOptions()}
                          style={{height: 360}}/>
}

export default WorldMapMarkerLine

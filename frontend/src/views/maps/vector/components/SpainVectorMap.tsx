import BaseVectorMap from '@/components/BaseVectorMap'
import {getSpainMapOptions} from '@/views/maps/vector/data'

import 'jsvectormap'
import 'jsvectormap/dist/maps/spain'

const SpainVectorMap = () => {
    return <BaseVectorMap id="spain-map" options={getSpainMapOptions()} style={{height: 360}}/>
}

export default SpainVectorMap

import BaseVectorMap from '@/components/BaseVectorMap'
import {getIraqMapOptions} from '@/views/maps/vector/data'

import 'jsvectormap'
import 'jsvectormap/dist/maps/iraq'

const IraqVectorMap = () => {
    return <BaseVectorMap id="iraq-map" options={getIraqMapOptions()} style={{height: 360}}/>
}

export default IraqVectorMap

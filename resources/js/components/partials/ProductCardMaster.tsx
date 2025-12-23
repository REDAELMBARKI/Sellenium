


import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx'
import Card1 from '@/Pages/admin/pages/settings/configStore/cardsConfig/cardsPrototypes/Card1'
import Card2 from '@/Pages/admin/pages/settings/configStore/cardsConfig/cardsPrototypes/Card2'
import Card3 from '@/Pages/admin/pages/settings/configStore/cardsConfig/cardsPrototypes/Card3'
import Card4 from '@/Pages/admin/pages/settings/configStore/cardsConfig/cardsPrototypes/Card4'
import { Card5 } from '@/Pages/admin/pages/settings/configStore/cardsConfig/cardsPrototypes/Card5'
import { Card6 } from '@/Pages/admin/pages/settings/configStore/cardsConfig/cardsPrototypes/Card6'
import { ProductClient } from '@/types/clientSideTypes'
import {  CardOption } from '@/types/StoreConfigTypes'

export default function ProductCardMaster({product}:{product : ProductClient}) {
  const {state : {currentCardConf : {cardId}}} = useStoreConfigCtx()

  const cardsMap : Record<CardOption , any>  =  {
    'card-1'  : Card1 ,
    'card-2'  : Card2 , 
    'card-3'  : Card3 , 
    'card-4'  : Card4 , 
    'card-5'  : Card5 , 
    'card-6'  : Card6
  }

  const Card = cardsMap[cardId] ;
  return (
    <>
          <Card product={product} />
    </>
  )
}

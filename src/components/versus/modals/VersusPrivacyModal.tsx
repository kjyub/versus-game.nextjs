import * as VS from '@/styles/VersusStyles'
import { PrivacyTypeIcons, PrivacyTypeNames, PrivacyTypes } from '@/types/VersusTypes'
import { Dispatch, SetStateAction } from 'react'

interface IVersusPrivacyModal {
  privacyType: PrivacyTypes
  setPrivacyType: Dispatch<SetStateAction<PrivacyTypes>>
  close: () => void
}
export default function VersusPrivacyModal({ privacyType, setPrivacyType, close }: IVersusPrivacyModal) {
  const handlePrivacyType = (_privacyType) => {
    setPrivacyType(_privacyType)
    close()
  }

  return (
    <VS.PrivacyModalLayout>
      <span className="title">공개 옵션</span>

      <div className="flex flex-col mt-4 space-y-2">
        <VS.PrivacyModalItem
          $is_active={privacyType === PrivacyTypes.PUBLIC}
          onClick={() => {
            handlePrivacyType(PrivacyTypes.PUBLIC)
          }}
        >
          {PrivacyTypeIcons[PrivacyTypes.PUBLIC]}
          <div className="info">
            <span className="title">{PrivacyTypeNames[PrivacyTypes.PUBLIC]}</span>
            <p className="content">누구나 볼 수 있습니다.</p>
          </div>
        </VS.PrivacyModalItem>
        <VS.PrivacyModalItem
          $is_active={privacyType === PrivacyTypes.RESTRICTED}
          onClick={() => {
            handlePrivacyType(PrivacyTypes.RESTRICTED)
          }}
        >
          {PrivacyTypeIcons[PrivacyTypes.RESTRICTED]}
          <div className="info">
            <span className="title">{PrivacyTypeNames[PrivacyTypes.RESTRICTED]}</span>
            <p className="content">링크를 가지고 있으면 볼 수 있습니다.</p>
          </div>
        </VS.PrivacyModalItem>
        <VS.PrivacyModalItem
          $is_active={privacyType === PrivacyTypes.PRIVATE}
          onClick={() => {
            handlePrivacyType(PrivacyTypes.PRIVATE)
          }}
        >
          {PrivacyTypeIcons[PrivacyTypes.PRIVATE]}
          <div className="info">
            <span className="title">{PrivacyTypeNames[PrivacyTypes.PRIVATE]}</span>
            <p className="content">작성자만 볼 수 있습니다.</p>
          </div>
        </VS.PrivacyModalItem>
      </div>
    </VS.PrivacyModalLayout>
  )
}

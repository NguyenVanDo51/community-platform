import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { Button, ExternalLink } from 'oa-components'
import { useCommonStores } from 'src/index'
import { Flex, Text } from 'theme-ui'

import { IMPACT_REPORT_LINKS } from './constants'
import { invisible, missing } from './labels'

import type { IImpactYear, IImpactYearFieldList, IUserPP } from 'src/models'

interface Props {
  fields: IImpactYearFieldList | undefined
  user: IUserPP | undefined
  visibleFields: IImpactYearFieldList | undefined
  year: IImpactYear
}

const isAllInvisible = (fields, visibleFields) => {
  if (
    visibleFields &&
    visibleFields.length === 0 &&
    fields &&
    fields.length > 0
  ) {
    return true
  }

  return false
}

const isPageOwnerCheck = (activeUser, user) => {
  const usersPresent = activeUser && user
  const usersTheSame = toJS(activeUser)?.userName === user?.userName

  return usersPresent && usersTheSame ? true : false
}

export const ImpactMissing = observer((props: Props) => {
  const { fields, user, visibleFields, year } = props
  const { userStore } = useCommonStores().stores

  const labelSet = isAllInvisible(fields, visibleFields) ? invisible : missing

  const isPageOwner = isPageOwnerCheck(userStore.activeUser, user)

  const userButton = `${year} ${labelSet.user.link}`
  const label = isPageOwner ? labelSet.owner.label : labelSet.user.label

  return (
    <Flex sx={{ flexFlow: 'column', gap: 2, mt: 2 }}>
      <Text>{label}</Text>
      {!isPageOwner && (
        <ExternalLink href={IMPACT_REPORT_LINKS[year]}>
          <Button>{userButton}</Button>
        </ExternalLink>
      )}
      {isPageOwner && (
        <a href="/settings">
          <Button>{labelSet.owner.link}</Button>
        </a>
      )}
    </Flex>
  )
})

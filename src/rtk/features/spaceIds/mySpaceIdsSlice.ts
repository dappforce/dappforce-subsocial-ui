import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { FetchOneArgs, ThunkApiConfig } from 'src/rtk/app/helpers'
import { SelectOneFn } from 'src/rtk/app/hooksCommon'
import { RootState } from 'src/rtk/app/rootReducer'
import { SpaceId, AccountId } from 'src/types'
import { bnsToIds } from 'src/types/utils'

export type MySpaceIds = {
  /** `id` is an account id that follows spaces. */
  id: AccountId
  mySpaceIds: SpaceId[]
}

const adapter = createEntityAdapter<MySpaceIds>()

const spacesSelectors = adapter.getSelectors<RootState>(state => state.mySpaceIds)

// Rename the exports for readability in component usage
export const {
  // selectById: selectMySpaceIdsByAccount,
  selectIds: selectAllMySpace,
  // selectEntities: selectMySpaceIdsEntities,
  // selectAll: selectAllMySpaceIds,
  // selectTotal: selectTotalMySpace
} = spacesSelectors

type Args = {}

export const _selectMySpaceIdsByAccount:
  SelectOneFn<Args, MySpaceIds | undefined> = (
    state,
    { id: myAddress }
  ) =>
    spacesSelectors.selectById(state, myAddress)

export const selectMySpaceIdsByAccount = (state: RootState, id: AccountId) => 
  _selectMySpaceIdsByAccount(state, { id })?.mySpaceIds || []

type FetchOneSpaceIdsArgs = FetchOneArgs<Args>

type FetchOneRes = MySpaceIds | undefined

export const fetchMySpaceIdsByAccount = createAsyncThunk
  <FetchOneRes, FetchOneSpaceIdsArgs, ThunkApiConfig>(
  'spaces/fetchOne',
  async ({ api, id }, { getState }) => {

    const myAddress = id as AccountId
    const knownSpaceIds = selectMySpaceIdsByAccount(getState(), myAddress)
    const isKnownFollower = typeof knownSpaceIds !== 'undefined'
    if (isKnownFollower) {
      // Nothing to load: space ids followed by this account are already loaded.
      return undefined
    }

    const spaceIds = await api.substrate.spaceIdsByOwner(myAddress)

    return {
      id: myAddress,
      mySpaceIds: bnsToIds(spaceIds)
    }
  }
)

const slice = createSlice({
  name: 'mySpaceIds',
  initialState: adapter.getInitialState(),
  reducers: {
    upsertMySpaceIdsByAccount: adapter.upsertOne,
  },
  extraReducers: builder => {
    builder.addCase(fetchMySpaceIdsByAccount.fulfilled, (state, { payload }) => {
      if (payload) adapter.upsertOne(state, payload)
    })
  }
})

export const {
  upsertMySpaceIdsByAccount,
} = slice.actions

export default slice.reducer
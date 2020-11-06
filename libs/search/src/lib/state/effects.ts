import { Injectable } from '@angular/core'
import { AuthService } from '@lib/auth'
import { SearchApiService } from '@lib/gn-api'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { select, Store } from '@ngrx/store'
import { SearchResponse } from 'elasticsearch'
import { of } from 'rxjs'
import { switchMap, withLatestFrom } from 'rxjs/operators'
import { ElasticsearchMetadataModels } from '../elasticsearch/constant'
import { ElasticsearchMapper } from '../elasticsearch/elasticsearch.mapper'
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service'
import {
  AddResults,
  ClearResults,
  RequestMoreResults,
  REQUEST_MORE_RESULTS,
  SetResponseAggregations,
  SORT_BY,
  UPDATE_FILTERS,
} from './actions'
import { SearchState } from './reducer'
import { getSearchState } from './selectors'

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private searchService: SearchApiService,
    private store$: Store<SearchState>,
    private authService: AuthService,
    private esService: ElasticsearchService
  ) {}

  clearResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SORT_BY, UPDATE_FILTERS),
      switchMap(() => of(new ClearResults(), new RequestMoreResults()))
    )
  )

  loadResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(REQUEST_MORE_RESULTS),
      switchMap(() => this.authService.authReady()), // wait for auth to be known
      withLatestFrom(this.store$.pipe(select(getSearchState))),
      switchMap(([_, state]) =>
        this.searchService.search(
          'bucket',
          JSON.stringify(
            this.esService.search(state, ElasticsearchMetadataModels.SUMMARY)
          )
        )
      ),
      switchMap((response: SearchResponse<any>) => {
        const mapper = new ElasticsearchMapper(response)
        const records = mapper.toRecordSummary()
        const aggregations = response.aggregations
        return [
          new AddResults(records),
          new SetResponseAggregations(aggregations),
        ]
      })
    )
  )
}

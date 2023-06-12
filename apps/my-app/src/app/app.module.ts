import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'
import { NxWelcomeComponent } from './nx-welcome.component'

import {EffectsModule} from '@ngrx/effects'
import {MetaReducer, StoreModule} from '@ngrx/store'
import {StoreDevtoolsModule} from '@ngrx/store-devtools'
import {storeFreeze} from 'ngrx-store-freeze'
import {Configuration, ConfigurationParameters,} from '@geonetwork-ui/data-access/gn4'
import { FeatureSearchModule} from '@geonetwork-ui/feature/search'
import {TRANSLATE_DEFAULT_CONFIG} from '@geonetwork-ui/util/i18n'
import {TranslateModule} from '@ngx-translate/core'
import { HttpClientModule } from '@angular/common/http'

export const metaReducers: MetaReducer<any>[] =   [storeFreeze];

const configurationParameters: ConfigurationParameters = {
  basePath: 'https://usage.geocat.live/catalogue/srv/api',
}

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
    imports: [ BrowserModule,
      HttpClientModule,
      TranslateModule.forRoot(TRANSLATE_DEFAULT_CONFIG),
      StoreModule.forRoot({}, {metaReducers}),
      StoreDevtoolsModule.instrument()  ,
      EffectsModule.forRoot(),
      FeatureSearchModule
    ],
  providers: [ {
        provide: Configuration,
        useValue: new Configuration(configurationParameters),
      }
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}

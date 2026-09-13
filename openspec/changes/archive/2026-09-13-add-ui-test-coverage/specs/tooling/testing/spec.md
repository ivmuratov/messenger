## ADDED Requirements

### Requirement: Unit-тесты native-стилевых утилит в @ui

Пакет `@ui` MUST содержать unit-тесты для модулей `packages/ui/src/shared/utils/`: `nativeVariants`, `defineNativeProperties` + `createNativeSprinkles`, `nativeRecipe`. Тесты MUST проверять наблюдаемое поведение (возвращаемые стили и массивы стилей), а не внутреннюю реализацию `StyleSheet.create`.

#### Scenario: nativeVariants без mapData

- **WHEN** выполняется unit-тест `nativeVariants` с токеном без функции-маппера
- **THEN** результат MUST содержать ключи токена
- **AND** значения MUST соответствовать исходным стилям токена

#### Scenario: nativeVariants с mapData

- **WHEN** выполняется unit-тест `nativeVariants` с функцией-маппером
- **THEN** каждый ключ токена MUST быть преобразован через mapData

#### Scenario: createNativeSprinkles с shorthands

- **WHEN** выполняется unit-тест `createNativeSprinkles` с shorthand-пропом (например, `m: "sm"`)
- **THEN** результат MUST включать стили всех свойств, перечисленных в shorthand

#### Scenario: nativeRecipe с base и variants

- **WHEN** выполняется unit-тест `nativeRecipe` с base и выбранными variant-опциями
- **THEN** результат MUST быть массивом, содержащим base-стиль и стили выбранных вариантов

### Requirement: Unit-тест useThemedNativeStyles

Пакет `@ui` MUST содержать unit-тест для хука `useThemedNativeStyles`. Тест MUST использовать `renderHook` с Provider-обёрткой `ThemeContext`. Отдельные тесты для `shared/contexts/themes.ts` MUST NOT требоваться.

#### Scenario: Хук внутри ThemeContext

- **WHEN** `useThemedNativeStyles` вызывается внутри `ThemeContext.Provider` со значением `"light"` или `"dark"`
- **THEN** хук MUST вернуть соответствующий объект темы из `themes`

#### Scenario: Хук вне ThemeContext

- **WHEN** `useThemedNativeStyles` вызывается без Provider с валидной темой
- **THEN** хук MUST выбросить ошибку с сообщением о необходимости ThemeProvider

### Requirement: Web e2e-сценарии drawer и темы

Web-приложение MUST содержать e2e-тесты в `apps/web/e2e/`, покрывающие главную страницу (`/`): переключение drawer и смену темы.

#### Scenario: Открытие и закрытие drawer

- **WHEN** пользователь на главной странице нажимает кнопку переключения drawer
- **THEN** боковая панель MUST стать доступной для взаимодействия (`aria-hidden="false"`)
- **WHEN** пользователь нажимает кнопку повторно
- **THEN** боковая панель MUST быть скрыта (`aria-hidden="true"`)

#### Scenario: Переключение темы

- **WHEN** пользователь на главной странице нажимает кнопку смены темы (`aria-label="Toggle theme"`)
- **THEN** атрибут `data-theme` на `document.documentElement` MUST измениться на противоположное значение (`light` ↔ `dark`)

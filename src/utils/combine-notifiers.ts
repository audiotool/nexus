import { Notifier, type Observable } from "./observable-notifier"
import type { ObservableValue } from "./observable-notifier-value"
import { ValueNotifier } from "./observable-notifier-value"

/** Takes a series of boolean notifiers, creates a boolean observable
 * that is always the AND of the inputted notifiers.
 */
export const combinedValueNotifiersWithAnd = (
  ...notifiers: ObservableValue<boolean>[]
): ValueNotifier<boolean> => {
  const notifier = new ValueNotifier(true)
  const update = () => notifier.setValue(notifiers.every((v) => v.getValue()))
  notifiers.forEach((v) => v.subscribe(() => update()))
  update()
  return notifier
}

/** Takes a set of observables, and merges them into one, notifying if any of
 * the observables emits a value.
 *
 * The type is slightly complicated, but it just merges the observables type using `|`.
 */
export const combineObservables = <T extends Observable<unknown>[]>(
  ...observables: T
): Observable<T[number] extends Observable<infer U> ? U : never> => {
  const notifier = new Notifier<
    T[number] extends Observable<infer U> ? U : never
  >()
  observables.forEach((observable) => {
    observable.subscribe((value) => {
      notifier.notify(
        value as T[number] extends Observable<infer U> ? U : never,
      )
    })
  })
  return notifier
}

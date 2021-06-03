/** Test helpers */
import { clearFixture, createEvent, getFixture } from '../../helpers/fixture'
import { enableDismissTrigger } from '../../../src/util/plugin-functions'

describe('Plugin functions', () => {
  let fixtureEl
  const getPluginMock = spy => {
    const pluginMock = function () {}
    pluginMock.NAME = 'test'
    pluginMock.getOrCreateInstance = function (el) {
      return spy(el)
    }

    return pluginMock
  }

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })
  describe('data-bs-dismiss functionality', () => {
    it('should get Plugin and execute callback, given arguments the plugin and the event, when a click occurred on data-bs-dismiss="PluginName"', () => {
      fixtureEl.innerHTML = [
        '<div id="foo" class="test">',
        '      <button type="button" data-bs-dismiss="test" data-bs-target="#foo"></button>',
        '</div>'
      ].join('')

      const spy = jasmine.createSpy('spy')
      const spy2 = jasmine.createSpy('spy2')
      const pluginMock = getPluginMock(spy)

      const pluginWrapper = fixtureEl.querySelector('#foo')
      const btnClose = fixtureEl.querySelector('[data-bs-dismiss="test"]')
      const event = createEvent('click')

      enableDismissTrigger((instance, event) => spy2(instance, event), pluginMock)
      btnClose.dispatchEvent(event)

      expect(spy).toHaveBeenCalledWith(pluginWrapper)
      expect(spy2).toHaveBeenCalledWith(pluginMock.getOrCreateInstance(pluginWrapper), event)
    })
    it('if  data-bs-dismiss="PluginName" hasn\'t got bs-target, "getOrCreateInstance" has to be initialized by closest "plugin.Name" class', () => {
      fixtureEl.innerHTML = [
        '<div id="foo" class="test">',
        '      <button type="button" data-bs-dismiss="test"></button>',
        '</div>'
      ].join('')

      const spy = jasmine.createSpy('spy')
      const spy2 = jasmine.createSpy('spy2')
      const pluginMock = getPluginMock(spy)

      const pluginWrapper = fixtureEl.querySelector('#foo')
      const btnClose = fixtureEl.querySelector('[data-bs-dismiss="test"]')
      const event = createEvent('click')

      enableDismissTrigger((instance, event) => spy2(instance, event), pluginMock)
      btnClose.dispatchEvent(event)

      expect(spy).toHaveBeenCalledWith(pluginWrapper)
    })

    it('if  data-bs-dismiss="PluginName" is disabled, must not trigger function', () => {
      fixtureEl.innerHTML = [
        '<div id="foo" class="test">',
        '      <button type="button" disabled data-bs-dismiss="test"></button>',
        '</div>'
      ].join('')

      const spy = jasmine.createSpy('spy')
      const spy2 = jasmine.createSpy('spy2')
      const pluginMock = getPluginMock(spy)

      const btnClose = fixtureEl.querySelector('[data-bs-dismiss="test"]')
      const event = createEvent('click')

      enableDismissTrigger((instance, event) => spy2(instance, event), pluginMock)
      btnClose.dispatchEvent(event)

      expect(spy).not.toHaveBeenCalled()
    })

    it('should prevent default when the trigger is <a> or <area>', () => {
      fixtureEl.innerHTML = [
        '<div id="foo" class="test">',
        '      <a type="button" data-bs-dismiss="test"></a>',
        '</div>'
      ].join('')
      const spy = jasmine.createSpy('spy')
      const spy2 = jasmine.createSpy('spy2')
      const pluginMock = getPluginMock(spy)

      const btnClose = fixtureEl.querySelector('[data-bs-dismiss="test"]')
      const event = createEvent('click')

      enableDismissTrigger((instance, event) => spy2(instance, event), pluginMock)

      spyOn(Event.prototype, 'preventDefault').and.callThrough()

      btnClose.dispatchEvent(event)

      expect(Event.prototype.preventDefault).toHaveBeenCalled()
    })
  })
})


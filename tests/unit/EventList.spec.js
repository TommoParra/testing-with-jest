import EventList from '@/views/EventList'
import { mount } from '@vue/test-utils'
import store from '@/store'
import router from '@/router'
import { createStore } from '@/store'
import { events as mockEvents } from '../../db.json'

function MountEventList(config = {}) {
    const plugins = config.plugins || [store, router]
    const mountOptions = config.mountOptions || {}
  
    return mount(EventList, {
      global: {
        plugins: plugins
      },
      ...mountOptions
    })
  }

describe('EventList', () => {
  it('should render the events', () => {
    const wrapper = MountEventList()
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('page title', () => {
    it('is rendered with the correct text', () => {
      const wrapper = MountEventList()
      const title = wrapper.find('[data-testid=event-list-title]')
      expect(title.exists()).toBeTruthy()
      expect(title.text()).toContain('Events for Good')
    })
  })

  describe('events', () => {
    it('are rendered in a list with necessary information', () => {
      const mockStore = createStore({
        state: () => ({
          events: mockEvents
        }),
        actions: {
          fetchEvents: jest.fn()
        }
      })
      
      const wrapper = MountEventList({
        plugins: [mockStore, router]
      })
      const events = wrapper.findAll('[data-testid=event]')
      expect(events).toHaveLength(mockEvents.length)

      events.forEach((event, i) => {
        const eventText = event.text()
        expect(eventText).toContain(mockEvents[i].title)
        expect(eventText).toContain(mockEvents[i].date)
      })
    })
  })
})

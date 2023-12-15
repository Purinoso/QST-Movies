package qst

import qst.initialization.Initialization
import qst.initialization.JsonInitialization

class BootStrap {
    def init = { servletContext ->
        JsonInitialization.initialize()
        Initialization.start()
    }
    def destroy = {
    }
}

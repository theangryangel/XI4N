require 'json'

module Jekyll
  module Xi4n
    class Version < Liquid::Tag
       def initialize(name, params, tokens)
          super
        end

        def render(context)
          p = JSON.parse( IO.read('../../package.json') )
          p['version']
        end
      end
  end
end


Liquid::Template.register_tag('xi4n_version', Jekyll::Xi4n::Version)

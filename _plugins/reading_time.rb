# Reading time calculator plugin for Jekyll
module Jekyll
  module ReadingTimeFilter
    def reading_time(input)
      words_per_minute = 180
      words = input.split.size
      minutes = (words / words_per_minute).ceil
      
      if minutes == 1
        "#{minutes} min read"
      else
        "#{minutes} min read"
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::ReadingTimeFilter)
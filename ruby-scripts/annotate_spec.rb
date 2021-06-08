def read_lf(fullname)
  path = File.expand_path(fullname, File.dirname(__FILE__))
  file = File.open(path).read

  file.gsub!(/\/\*.*?\*\//m) do |match|
    "<span class=\"comment\">#{match}</span>"
  end

  file.gsub!(/%.*?\n/) do |match|
    "<span class=\"comment\">#{match.chop}</span>\n"
  end

  file.gsub!(/accumulate ([^.]*)\./,
             'accumulate \1. <a class="view" href="code/\1.lf">[View \1.lf]</a>')

  return file
end

def contents(path, name)
  title = "Specification: #{name}"
  # if (elements[0].tag == :comment) then
  #   first, *elements = *elements
  #   title = first.text.gsub(/^%* */, "")
  # end

  title_comment = title
  # if (elements[0].tag == :pre_end &&
  #     elements[1].tag == :html_comment &&
  #     elements[2].tag == :pre_start) then
  #   pre_end, title_comment, pre_start, *elements = *elements
  # end

  # while (elements[0].tag == :whitespace) do
  #   first, *elements = *elements
  # end

<<-eos
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<title>Adelfa: #{title}</title>
<link href="style.css" rel="stylesheet" type="text/css" />
</head>

<body>

<div class="section" id="specification">
<h1>Specification</h1>

<a class="view" href="code/#{name}.lf">[View #{name}.lf]</a>
<pre class="command">
#{read_lf(path+"/"+name+".lf")}
</pre>

</div>
</body>
</html>
        eos
end

print contents(ARGV[0],ARGV[1])

import { convert as converter } from "../md2tex";
import dd from "dedent-tabs";

const convert = (content, config = { loglevel: "log"}) => {
	return converter(content, config);
}

describe("md2tex", () => {
	it("headlines", () => {
		expect(
			convert(dd`
				# H1
				## H2
				### H3
				#### H4
				##### H5
				###### H6
			`)
		).toMatchSnapshot();
	});
	it("headlines with escaped characters", () => {
		expect(
			convert(dd`
				# escapes
				## blocks
				### ~ tilde ~
				### ^I don't know
				### \\ backslash \\
				## & other &
				### % procent %
				### $ money $ dollar
				### # hashtag #
				### _ underscore _
				###### ({brackets})
			`)
		).toMatchSnapshot();
	});
	it("headlines with styles and code", () => {
		expect(
			convert(dd`
				# *italic* _underscore_
				## \`Code\` headline
			`)
		).toMatchSnapshot();
	});
	it("inline styles", () => {
		expect(
			convert(dd`
				*italic* normal _italic_
				**bold** normal __bold__
			`)
		).toMatchSnapshot();
	});
	it("inline styles with escaped charachters", () => {
		expect(
			convert(dd`
				*italic* & _italic \\ backslash_
				**bold** {} __bolder $ money__.
			`)
		).toMatchSnapshot();
	});
	it("inline styles with links and images", () => {
		expect(
			convert(dd`
				*italic* [link](without_any_italic_styles) _italic_
				**bold** ![images](shouldn**t**be__bold__eighter).
			`)
		).toMatchSnapshot();
	});
	it("inline code blocks", () => {
		expect(
			convert(dd`hi \`code\` and more \`code\` inline`)
		).toMatchSnapshot();
	});
	it("biblatex source", () => {
		expect(convert(dd`some [source](\`BibRefName\`)`)).toMatchSnapshot();
	});
	it("footnotes", () => {
		expect(convert(dd`some [footnote](footnote text)`)).toMatchSnapshot();
	});
	it("footnotes with inline code", () => {
		expect(convert(dd`some [footnote](footnote \`code\` and more)`)).toMatchSnapshot();
	});
	it("escape special chars in footnotes", () => {
		expect(
			convert(dd`
			I have [the special char # in my footnote](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots)
		`)
		).toMatchSnapshot();
	});

	it("images", () => {
		expect(convert(dd`some ![image](url)`)).toMatchSnapshot();
	});
	it("ordered list", () => {
		expect(
			convert(dd`
		1. first entry
			1. first indentation
				1. even more indentation
		2. second entry
			1. indented
				1. and done
		`)
		).toMatchSnapshot();
	});
	it("unordered list", () => {
		expect(
			convert(dd`
		- first entry
			- first indentation
				- even more indentation
		- second entry
			- indented
				- and done
		`)
		).toMatchSnapshot();
	});
	it("mixed list", () => {
		expect(
			convert(dd`
		1. first entry
			- first indentation
				- even more indentation
			- second subentry
		2. second entry
			1. indented
				- unorderd sublist
		`)
		).toMatchSnapshot();
	});
	it("escape chars in lists", () => {
		expect(
			convert(dd`
		- first & second
			- backslash: \\
		`)
		).toMatchSnapshot();
	});
	it("code blocks", () => {
		expect(
			convert(dd`
			some text before
			\`\`\`js
			console.log("Hi");
			\`\`\`
			and some behind
		`)
		).toMatchSnapshot();
	});
	it("code block with captions", () => {
		expect(
			convert(dd`
			some text before
			\`\`\`js [JS Hello World]
			console.log("Hi");
			\`\`\`
		`)
		).toMatchSnapshot();
	});
	it("raw latex blocks", () => {
		expect(
			convert(dd`
			some text before
			\`\`\`latex
			\\textbackslash backslash
			\`\`\`
			and some behind
		`)
		).toMatchSnapshot();
	});
	it("log error for unsupported heading levels", () => {
		expect(
			convert(dd`
			######## H8 is unsupported, errors are expected
		`)
		).toMatchSnapshot();
	});
	it("apply linebreaks", () => {
		expect(
			convert(dd`
			I wan't to be in the same textblock
			but I also wan't to be on a seperate line

			Please, let me go into a new textblock :help:
		`)
		).toMatchSnapshot();
	});
	it("no linebreak after listings", () => {
		expect(
			convert(dd`
			- I am
			- a List
			With some text directly afterwards

			- I am
			- a List

			With an empty line and text following

			- I am
			- a List

			With an empty line and text following
			with multiple lines should have a linebreak
		`)
		).toMatchSnapshot();
	});
	it("links directly after links", () => {
		expect(
			convert(dd`
			[link1](target1)[link2](target2)[](target3)
		`)
		).toMatchSnapshot();
	});
});

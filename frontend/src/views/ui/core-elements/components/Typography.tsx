import ComponentCard from '@/components/ComponentCard'
import {Col, Row} from 'react-bootstrap'

const DisplayHeadings = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Display Headings</h5>
            <h1 className="display-1">Display 1</h1>
            <h1 className="display-2">Display 2</h1>
            <h1 className="display-3">Display 3</h1>
            <h1 className="display-4">Display 4</h1>
            <h1 className="display-5">Display 5</h1>
            <h1 className="display-6">Display 6</h1>
        </>
    )
}

const Headings = () => {
    return (
        <>
            <div>
                <h5 className="mb-2 pb-1">Headings</h5>

                <h1>
                    Heading 1 <small>Sub Heading</small>
                </h1>
                <h2>
                    Heading 2 <small>Sub Heading</small>
                </h2>
                <h3>
                    Heading 3 <small>Sub Heading</small>
                </h3>
                <h4>
                    Heading 4 <small>Sub Heading</small>
                </h4>
                <h5>
                    Heading 5 <small>Sub Heading</small>
                </h5>
                <h6>
                    Heading 6 <small>Sub Heading</small>
                </h6>
            </div>
            <div className="mt-4">
                <h5 className="mb-2 pb-1">Naming a Source</h5>
                <figure>
                    <blockquote className="blockquote">
                        <p>"Design is not just what it looks like and feels like. Design is how it works."</p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                        Steve Jobs in <cite title="Design Philosophy">Design Philosophy</cite>
                    </figcaption>
                </figure>
            </div>
        </>
    )
}

const InlineTextElements = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Inline Text Elements</h5>
            <p className="text-muted">Styling for common inline HTML5 elements.</p>
            <p className="lead">Your title goes here</p>
            <p>
                You can use the mark tag to <mark>highlight</mark> text.
            </p>
            <p>
                <del>This line of text is meant to be treated as deleted text.</del>
            </p>
            <p>
                <s>This line of text is meant to be treated as no longer accurate.</s>
            </p>
            <p>
                <ins>This line of text is meant to be treated as an addition to thedocument.</ins>
            </p>
            <p>
                <u>This line of text will render as underlined</u>
            </p>
            <p>
                <small>This line of text is meant to be treated as fine print.</small>
            </p>
            <p>
                <strong>This line rendered as bold text.</strong>
            </p>
            <p>
                <em>This line rendered as italicized text.</em>
            </p>
            <p className="mb-0">
                Nulla <abbr title="attribute">attr</abbr> vitae elit libero, a pharetra augue.
            </p>
        </>
    )
}

const Unordered = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Unordered </h5>
            <ul>
                <li>Fully responsive design</li>
                <li>Built with Bootstrap 5 framework</li>
                <li>Clean and modern UI components</li>
                <li>Cross-browser compatibility</li>
                <li>
                    Multiple form elements and validations
                    <ul>
                        <li>Rich input controls</li>
                        <li>Step-based form wizards</li>
                        <li>Real-time validation</li>
                        <li>Customizable styles</li>
                    </ul>
                </li>
                <li>Advanced chart and graph libraries</li>
                <li>Integrated data tables and sorting</li>
                <li>Developer-friendly code structure</li>
            </ul>
        </>
    )
}

const Ordered = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">ordered </h5>
            <ol>
                <li>Install all dependencies</li>
                <li>Configure project environment settings</li>
                <li>Set up folder structure and routing</li>
                <li>Integrate UI components and layout</li>
                <li>
                    Implement core modules
                    <ol>
                        <li>Authentication &amp; Authorization</li>
                        <li>Dashboard widgets and metrics</li>
                        <li>User profile management</li>
                        <li>Notification &amp; messaging systems</li>
                    </ol>
                </li>
                <li>Connect backend APIs and test data flow</li>
                <li>Optimize performance and responsive design</li>
                <li>Final testing and deployment</li>
            </ol>
        </>
    )
}

const Unstyled = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Unstyled </h5>
            <ul className="list-unstyled">
                <li>Install project dependencies</li>
                <li>
                    Configure build settings
                    <ul>
                        <li>Update environment variables</li>
                    </ul>
                </li>
                <li>Setup project structure and routes</li>
                <li>Launch local development server</li>
            </ul>
        </>
    )
}

const Abbreviations = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Abbreviations </h5>
            <p>
                <abbr title="attribute">attr</abbr>
            </p>
            <p>
                <abbr title="HyperText Markup Language" className="initialism">
                    HTML
                </abbr>
            </p>
        </>
    )
}

const Alignment = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Alignment </h5>
            <figure className="text-center">
                <blockquote className="blockquote">
                    <p>"Design is not just what it looks like and feels like. Design is how it works."</p>
                </blockquote>
                <figcaption className="blockquote-footer">
                    Steve Jobs in <cite title="Steve Jobs Biography">Steve Jobs Biography</cite>
                </figcaption>
            </figure>
            <figure className="text-end">
                <blockquote className="blockquote">
                    <p>"Simplicity is the ultimate sophistication."</p>
                </blockquote>
                <figcaption className="blockquote-footer">
                    Leonardo da Vinci in <cite title="Design Philosophy">Design Philosophy</cite>
                </figcaption>
            </figure>
        </>
    )
}

const Inline = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Inline</h5>
            <ul className="list-inline">
                <li className="list-inline-item">This is a list item.</li>
                <li className="list-inline-item">And another one.</li>
                <li className="list-inline-item">But they're displayed inline.</li>
            </ul>
        </>
    )
}

const Blockquotes = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Blockquotes </h5>
            <blockquote className="blockquote">
                <p className="mb-0">"Good design is obvious. Great design is transparent."</p>
            </blockquote>
            <figcaption className="blockquote-footer">
                Joe Sparano in <cite title="Design Principles">Design Principles</cite>
            </figcaption>
            <p className="text-muted m-b-15">Use text utilities as needed to change the alignment of your
                blockquote.</p>
            <blockquote className="blockquote text-center">
                <p className="mb-0">"First, solve the problem. Then, write the code."</p>
            </blockquote>
            <figcaption className="blockquote-footer text-center">
                John Johnson in <cite title="Developer Wisdom">Developer Wisdom</cite>
            </figcaption>
            <blockquote className="blockquote text-end">
                <p className="mb-0">"Simplicity is the soul of efficiency."</p>
            </blockquote>
            <figcaption className="blockquote-footer text-end">
                Austin Freeman in <cite title="Efficiency in Design">Efficiency in Design</cite>
            </figcaption>
        </>
    )
}

const DescriptionListAlignment = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Description List Alignment</h5>
            <dl className="row mb-0">
                <dt className="col-sm-3">Dashboard</dt>
                <dd className="col-sm-9">An overview panel that displays key metrics and activity summaries.</dd>
                <dt className="col-sm-3">Form Validation</dt>
                <dd className="col-sm-9">
                    <p>Includes validation for all major input types with real-time feedback.</p>
                    <p>Built-in support for custom rules and error messages.</p>
                </dd>
                <dt className="col-sm-3">Responsive Grid</dt>
                <dd className="col-sm-9">Utilizes Bootstrap’s flexible grid layout for consistent responsiveness across
                    devices.
                </dd>
                <dt className="col-sm-3 text-truncate">User Management Module</dt>
                <dd className="col-sm-9">Easily manage roles, permissions, and user profiles from a single interface.
                </dd>
                <dt className="col-sm-3">Nested Features</dt>
                <dd className="col-sm-9">
                    <dl className="row mb-0">
                        <dt className="col-sm-4">Email Notifications</dt>
                        <dd className="col-sm-8">Customizable alerts and triggers integrated into app workflows.</dd>
                    </dl>
                </dd>
            </dl>
        </>
    )
}

const Typography = () => {
    return (
        <>
            <ComponentCard title="Typography Variations">
                <Row className="g-4">
                    <Col xl={4}>
                        <DisplayHeadings/>
                    </Col>
                    <Col xl={4}>
                        <Headings/>
                    </Col>
                    <Col xl={4}>
                        <InlineTextElements/>
                    </Col>
                    <Col xl={4}>
                        <Unordered/>
                    </Col>
                    <Col xl={4}>
                        <Ordered/>
                    </Col>
                    <Col xl={4}>
                        <Unstyled/>
                    </Col>
                    <Col xl={4}>
                        <Abbreviations/>
                    </Col>
                    <Col xl={4}>
                        <Alignment/>
                    </Col>
                    <Col xl={4}>
                        <Inline/>
                    </Col>
                    <Col xl={6}>
                        <Blockquotes/>
                    </Col>
                    <Col xl={6}>
                        <DescriptionListAlignment/>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default Typography

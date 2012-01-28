<?php
/**
 * PTH to JSON converter
 *
 * PTH and Node classes taken verbatim from Dygear's PRISM project
 */
foreach (glob('./pth/*.pth') as $src)
{
	$dst = preg_replace('/.pth$/', '.json', $src);
	if (!pth2json($src, $dst))
		throw new Exception('Failed to write file '.$dst);

	echo 'Converted ',$src,' to ',$dst,"\n";
}

function pth2json($src, $dst, $resolution = 6)
{
	$pth = new PTH($src);

	$data = array(
		'track' => str_replace('.pst', '', basename($src)),
		'resolution' => round(1/$resolution, 2),
		'version' => $pth->Version, 
		'revision' => $pth->Revision, 
		'nodes' => array(), 
	);

	$i = 0;

	foreach ($pth->Node as $n)
	{
		if ($i == $pth->FinishLine)
			$data['startfinish'] = array('x' => $n->Center->X, 'y' => $n->Center->Y, 'z' => $n->Center->Z);

		if ($i % $resolution)
			$data['nodes'][] = array('x' => $n->Center->X, 'y' => $n->Center->Y, 'z' => $n->Center->Z);
		$i++;
	}

	$json = json_encode($data);

	if (file_put_contents($dst, $json) === false)
		return false;

	return true;
}

/*
 * @name: PTH File Parser
 * @author: Mark 'Dygear' Tomlin.
 * @license: The MIT License
 */
class PTH
{
	const HEADER = 'CVersion/CRevision/lNodes/lFinishLine';

	public $Version;
	public $Revision;
	public $Nodes;
	public $FinishLine;

	public function __construct($pthFilePath)
	{
		$this->file = file_get_contents($pthFilePath);
		$this->readHeader($this->file);
		for ($Node = 0; $Node < $this->Nodes; ++$Node)
			$this->Node[$Node] = $this->readNode($Node);
		unset($this->file);
	}
	protected function readHeader()
	{
		foreach (unpack(PTH::HEADER, substr($this->file, 6, 10)) as $property => $value)
			$this->$property = $value;
	}
	protected function readNode($Node)
	{
		$RawNode = substr($this->file, 16 + ($Node * 40), 40);
		$NodeObj = new Node;
		$NodeObj->readCenter($RawNode);
		$NodeObj->readDirection($RawNode);
		$NodeObj->readLimit($RawNode);
		$NodeObj->readRoad($RawNode);
		return $NodeObj;
	}
}

class Node
{
	const CENTER = 'lX/lY/lZ';
	const DIRECTION = 'fX/fY/fZ';
	const LIMIT = 'fLeft/fRight';
	const ROAD = 'fLeft/fRight';

	public $Center;
	public $Direction;
	public $Limit;
	public $Road;

	public function readCenter($RawNode)
	{
		$this->Center = (object) unpack(Node::CENTER, substr($RawNode, 0, 12));
	}
	public function readDirection($RawNode)
	{
		$this->Direction = (object) unpack(Node::DIRECTION, substr($RawNode, 12, 12));
	}
	public function readLimit($RawNode)
	{
		$this->Limit = (object) unpack(Node::LIMIT, substr($RawNode, 24, 8));
	}
	public function readRoad($RawNode)
	{
		$this->Road = (object) unpack(Node::ROAD, substr($RawNode, 32, 8));
	}
}
?>

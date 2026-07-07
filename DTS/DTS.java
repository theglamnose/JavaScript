/*
 *  Java source code for searching for a shortest path 
 *  in a deterministic transition system.
 *
 *  A deterministic transition system is a tuple (S, L, T) with
 *    1) a non-empty set of states S;
 *    2) a non-empty set of labels L;
 *    3) a partial mapping T: S * L -> S.
 *
 *  A transition system (S, L, T) can be implemented as follows:
 *    a) a mapping C: S -> P(L), with
 *            C(s) = { l ϵ L | (s,l) ϵ Def(T) }
 *       C delivers all labels, which are applicable to s.
 *    b) the mapping T.
 *
 *  Given a state s0 ϵ S and a sequence of labels p = (l0,..,ln) ϵ L⃰.
 *  Then p is called a path starting in s, if
 *  there exists a sequence of states (s1,..,s(n+1)) ϵ S⃰ with
 *     T(si,li) = s(i+1), for 0 ≤ i ≤ n.
 *
 *  Search problem for transition system (S, L, T):
 *     for a given start state s ϵ S and 
 *     a set of final states F ≤ S
 *     search for the shortest loop-free path from s to F.
 */

import java.util.ArrayDeque;
import java.util.ArrayList; 
import java.util.HashSet; 
import java.util.List;
import java.util.Set; 
 
 // Interface description for a transition system.
 
 interface DTS_Interface<State,Label> {
	 
	 // For a given state s return the set of applicable labels:
	 public Set<Label> getLabelSet(State s);
	 
	 // Deterministic partial transition function:
	 public State nextState(State s, Label l);
	 
	 // Start state:
	 public State getStart();
	 
	 // A set of final states:
	 public boolean isFinal(State s);
 }
 
 // Interface to work on a DTS.
 interface WorkOnDTS_Interface< Label>{
	 public List<Label> getShortestPath();
 }
 
 // Higer order class, which computes for a given DTS the shortest path.
 class WorkOnDTS< State, Label, DTS_par extends DTS_Interface< State, Label>>
							implements WorkOnDTS_Interface< Label>{								
	// Local variable with DTS to be examined:
	private DTS_par dts;
	
	// Constructor, which stores the DTS to work on.	
	 public WorkOnDTS( DTS_par d){
		 dts = d;
	 }
	 
	 // Compute shortes path from start state to a final state:
	 public List<Label> getShortestPath(){
		 
		// Queue of states to be examined. This set of states is the set of leaves in the spanning tree.
		ArrayDeque<State> sq = new ArrayDeque<State>();
		sq.add( dts.getStart());
		
		// Queue of label lists. Each member in the queue is a list of labels,
		// which is the sequence from the start state to the correponding state in the queue sq.
		ArrayDeque<List<Label>> pq = new ArrayDeque<List<Label>>();
		pq.add( new ArrayList<Label>());
		
		// Set of visited states. This prevents us of building loops.
		Set<State> vs = new HashSet<State>();
		vs.add( dts.getStart());
		
		State s, ns;		
		List<Label> p = new ArrayList<Label>();
		List<Label> p2 = new ArrayList<Label>();
		
		while( true){
			System.out.println( "sq:" + sq);
			System.out.println( "pq:" + pq);
			
			s = sq.pollFirst();
			System.out.println( "Visit state: " + s);
			if( s == null){ // Empty state queue: no path found.
				System.out.println( "   No path found.");
				return null;
			}
			
			p.clear();
			p.addAll( pq.pollFirst());
			
			System.out.println( "   Path: " + p);
			if( dts.isFinal( s)){
				System.out.println( "   Final state found.");
				return p; // Final state found.
			}			
			
			for( Label l : dts.getLabelSet( s)){
				ns = dts.nextState( s, l);
				System.out.println( "   " + l + " -> " + ns);
				if( vs.contains( ns)){
					// State already visited: skip.
					System.out.println( "   skip");
				}else{
					// New state.
					System.out.println( "   add");
					vs.add( ns);
					sq.add( ns);
					p2.clear();
					p2 = new ArrayList<Label>();
					p2.addAll( p);
					p2.add( l);
					pq.add( p2);	
				}							
			}					
		}
	 }
 }
 
 // Small transition system as an example:
 class TS implements DTS_Interface<Integer,String>{
	 public Set<String> getLabelSet(Integer s){
		 Set<String> ls = new HashSet<String>();
		 switch ( s){
			 case 0: ls.add( "suc");
				break;
			 case 1: case 2: ls.add( "suc"); ls.add( "pre");
				break;
			 case 3: ls.add( "pre");
				break;
			default:
				break;
		 }
		 return ls;
	 }
	 
	 public Integer nextState(Integer s, String l){
		 switch ( l){
			 case "suc":
				return (s+1);
			 case "pre":
				return (s-1);
			default:
				return s;
		 }
	 }
	 
	 public Integer getStart(){
		 return 3;		 
	 }
	 
	 public boolean isFinal(Integer s){
		 return ( s == 1);
	 }
 }
 
 public class DTS {
	public static void main(String[] args) {

		WorkOnDTS< Integer, String, TS> dts = new WorkOnDTS< Integer, String, TS>( new TS());
		System.out.println( "Shortest path: " + dts.getShortestPath());
		
		
        return;
    }	 
 }

import TestComponent from "./testcomponent";
import { createClient } from '@/lib/supabase/server';

export default async function Test(){
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    
    return (
        <div className="flex-col static">
            
            <div className="flex">
                <TestComponent user={"e21a7a60-a893-44c7-9fb9-09bb71095f1c"}/>
            </div>
        </div>       
    );
}